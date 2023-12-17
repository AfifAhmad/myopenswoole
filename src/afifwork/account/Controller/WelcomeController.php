<?php

namespace AfifWork\Account\Controller;

use AfifWork\Account\Controller\DbConnectController;
use co;
use OpenSwoole\Table;

class WelcomeController extends DbConnectController{

    public function loginAction()
    {
		$data = $this->view->render('account/login.html');
		$this->response->end($data);
    }
    
	public function indexAction()
	{
		$data = $this->view->render('index.html', ['name' => 'Fabien '.$inc]);
		$this->response->end($data);
	}
	
	public function dbAction()
	{
        $queryBuilder = $this->dbConnection->createQueryBuilder();
        $queryBuilder->select('id', 'username')
            ->from('rbac.accounts')
            ->where('id = :id')
            ->setParameter('id', '62622ad8-c99c-4f1a-83be-f858fe392e5a');
        $result = $queryBuilder->execute()->fetchAll();
        ob_start();
        print_r($result);
        $output = ob_get_clean();
		$data = $this->view->render('index.html', ['name' => $output]);
		$this->response->end($data);
	}
}