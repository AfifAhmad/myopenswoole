<?php 

namespace AfifWork\MVC;


use Symfony\Component\Finder\Finder;
use Laminas\Config\Factory;
use Laminas\ServiceManager\ServiceManager;
use AfifWork\MVC\Config;
use Laminas\Router\Http\TreeRouteStack;
use AfifWork\MVC\Request as LaminaRequest;
use OpenSwoole\HTTP\Server;
use OpenSwoole\HTTP\Request;
use OpenSwoole\HTTP\Response;
use Co;
use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use AfifWork\MVC\TwigFunctions;


use Laminas\Log\Writer\Stream;
use Laminas\Log\Logger;
use Slim\Http\Request as RequestSlim;

use function register_shutdown_function;

class MVC {
	
	private static $serviceManager;
	
	public static function initialize($appDirectory)
	{
		self::$serviceManager = new ServiceManager();
		self::$serviceManager->setService(Config::class, new Config(self::$serviceManager, $appDirectory));
		self::$serviceManager->get(Config::class);
		$routesList = self::$serviceManager->get(Config::class)->get("routes.php");
		$appconfig = self::$serviceManager->get(Config::class)->get("app.php");
        $router = new TreeRouteStack();
		$router->addRoutes($routesList["ok"]);
		
		$loader = new FilesystemLoader($appDirectory.'/views');
		$twig = new Environment($loader);
		$twig->addGlobal('base_path', $appconfig["base_path"]);
		$twig->addGlobal('static_path', $appconfig["static_path"]);
		TwigFunctions::attach($twig);
		self::$serviceManager->setService('twig', $twig);
		
		
		$writer = new Stream($appDirectory.'/log/app.log');
		$logger = new Logger();
		$logger->addWriter($writer);
		self::$serviceManager->setService('logger', $logger);
		
		register_shutdown_function( function()use($logger){
			ob_start();
			print_r(error_get_last());
			$errInformation = ob_get_clean();
			$logger->emerg($errInformation);
		});
		
        $host = $appconfig["host"];
        $port = $appconfig["port"];

        $server = new Server($host, $port);
        $server->on("Request",function(Request $request, Response $response)
        use(
        $router, $routesList,$server,$twig,$logger){
            $lamina_request = LaminaRequest::fromString($request->getData(), true);
            $matched = $router->match($lamina_request);
            
            $controller = null;
            try{
                if($matched){
                    $controller = new ($matched->getParam("controller"))();
                    $action = $matched->getParam("action")."Action";
                } else {
                    $controller = new ($routesList["notfound"]["controller"])();
                    $action = $routesList["notfound"]["action"]."Action";
                }
                $controller->setRequest($request)
                    ->setLaminaRequest($lamina_request)
                    ->setResponse($response)
                    ->setRouteData($matched)
                    ->setView($twig);
                    
                if(method_exists($controller, "before")){
                    $controller->before();
                }
                if(!$controller->isActionSkipped()){
                    $controller->$action();
                    if(method_exists($controller, "after")){
                        $controller->after();
                    }
                }
                if(method_exists($controller, "end")){
                    $controller->end();
                }
            }catch(\Exception $e){
                if(!is_null($controller)){
                    if(method_exists($controller, "end")){
                        $controller->end();
                    }
                }
                ob_start();
                print_r($e);
                $errInformation = ob_get_clean();
                $logger->emerg($errInformation);
            }
        });
        $server->start();

	}
	
	public static function getServiceManager()
	{
		return self::$serviceManager;
	}

}