<?php
namespace AfifWork\MVC\TwigFunctions;


class Json {
    
    public function encode($input)
    {
        return json_encode($input);
    }
}