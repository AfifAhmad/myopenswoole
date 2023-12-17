<?php

namespace AfifWork\Account\Controller;


use Doctrine\DBAL\DriverManager;
use AfifWork\MVC\MVC;
use AfifWork\MVC\Controller as MvcController;
use AfifWork\MVC\Config;

class DbConnectController extends MvcController{
    
    protected $dbConnection;
    
    public function __construct()
    {
        /*$dbConfig = MVC::getServiceManager()->get(Config::class)->get("database.php");
        $connectionParams = $dbConfig->getArrayCopy();
        $this->dbConnection = DriverManager::getConnection($connectionParams);
        $this->dbConnection->connect();*/
    }
    
    public function end()
    {
        /*$this->dbConnection->close();
        parent::end();*/
    }
    
    
}