<?php

namespace AfifWork\MVC;


class TwigFunctions 
{
    public static function attach($twig)
    {
        $json = new TwigFunctions\Json();
        $filter = new \Twig\TwigFilter('json_encode', [$json, 'encode']);
        $twig->addFilter($filter);
    }
}