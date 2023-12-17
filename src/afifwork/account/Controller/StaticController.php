<?php


namespace AfifWork\Account\Controller;

use AfifWork\MVC\Controller as MvcController;

class StaticController extends MvcController{
    
    
    public function indexAction()
    {
        $url = $this->routeData->getParam("url");
        $fullFilePath = "./static/".$url;
        $staticFile = $fullFilePath;
        if (! file_exists($staticFile)) {
            return false;
        } else {
            $static = [
                'html'  => 'text/html',
                'woff'  => 'application/font-woff',
                'css'  => 'text/css',
                'js'   => 'text/javascript',
                'png'  => 'image/png',
                'gif'  => 'image/gif',
                'jpg'  => 'image/jpg',
                'jpeg' => 'image/jpg',
                'mp4'  => 'video/mp4'
            ];
            $type = pathinfo($staticFile, PATHINFO_EXTENSION);
            if (! isset($static[$type])) {
                return false;
            } else {
                $this->response->header('Content-Type', $static[$type]);
                $this->response->sendfile($staticFile);
            }
        
        }
    }
    
    
    
}