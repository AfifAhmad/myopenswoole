<?php 

declare(strict_types=1);

namespace AfifWork\MVC;

use AfifWork\MVC\Factory\ConfigFactory;
use Laminas\ServiceManager\ServiceManager;
use Symfony\Component\Finder\Finder;
use Laminas\Config\Factory;

class Config {
	
	private $parentServiceManager;
	private $appDirectory;
	private $configServiceManager;
	
	public function __construct($serviceManager, $appDirectory)
	{
		$this -> parentServiceManager = $serviceManager;
		$this -> appDirectory = $appDirectory;
	}
	
	public function get($file)
	{
		if(is_null($this->configServiceManager)){
			$this->configServiceManager = new ServiceManager();
			$finder = new Finder();
			$configDirectory = $this->appDirectory."/config";
			$finder->files()->in($configDirectory)->name('/\.php$/');
			$configFactory = new ConfigFactory($this -> parentServiceManager, $configDirectory);
			foreach($finder as $objectFile){
				$absoluteFilePath = $objectFile->getRealPath();
				$fileNameWithExtension = $objectFile->getRelativePathname();
				$this->configServiceManager->setFactory($fileNameWithExtension, $configFactory);
			}
		}
		return $this->configServiceManager->get($file);
	}

}