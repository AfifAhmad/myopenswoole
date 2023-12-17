<?php

namespace AfifWork\MVC;


abstract class Controller {
	
	protected $_skipAction = false;
	protected $routeData = null;
	protected $request = null;
	protected $lamina_request = null;
	protected $response = null;
	protected $view = null;
	
	
	public function skippingAction($act)
	{
		$this->_skipAction = $act; 
		return $this;
	}
	
	public function isActionSkipped()
	{
		return $this->_skipAction;
	}
	
	public function setRequest($request)
	{
		$this->request = $request;
		return $this;
	}
	
	public function setRouteData($routeData)
	{
		$this->routeData = $routeData;
		return $this;
	}
	public function setLaminaRequest($lamina_request)
	{
		$this->lamina_request = $lamina_request;
		return $this;
	}
	
	public function setResponse($response)
	{
		$this->response = $response;
		return $this;
	}
	
	public function setView($view)
	{
		$this->view = $view;
		return $this;
	}
    public function end()
    {
	
        if($this->response->isWritable()){
            $this->response->end();
        }
    }
	
	
}