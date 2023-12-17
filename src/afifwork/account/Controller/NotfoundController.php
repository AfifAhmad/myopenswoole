<?php

namespace AfifWork\Account\Controller;

use AfifWork\MVC\Controller;

class NotfoundController extends Controller{

	public function indexAction()
	{
		$this->response->status(404);
		$this->response->end("Not Found");
	}
}