<?php 

namespace AfifWork\MVC\Factory;

use Psr\Container\ContainerInterface;
use AfifWork\MVC\Config;
use Laminas\Config\Factory;
use ArrayObject ;

class ConfigFactory {
	
	private $mainServiceManager;
	private $mainPath;
		
	public function __construct($mainServiceManager,$mainPath)
	{
		$this->mainServiceManager = $mainServiceManager;
		$this->mainPath = $mainPath;
	}
	
	
    public function __invoke(ContainerInterface $container, $requestedName)
    {
		$config = Factory::fromFile($this->mainPath.'/'.$requestedName);
        return new ArrayObject($config);
    }

}