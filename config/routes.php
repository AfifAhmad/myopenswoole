<?php

return array(
	'ok' => [
		'login' => [
			'type' => 'literal',
			'options' => [
				'route' => '/login',
				'defaults' => [
					'controller' => AfifWork\Account\Controller\WelcomeController::class,
					'action'     => 'login',
				],
			],
		],
		'static' => [
			'type' => 'regex',
			'options' => [
				'regex' => '/static/(?<url>.+)',
				'defaults' => [
					'controller' => AfifWork\Account\Controller\StaticController::class,
					'action'     => 'index',
				],
                'spec' => '/static/%url%',
			],
		],
		'bar' => [
			'type' => 'literal',
			'options' => [
				'route' => '/',
				'defaults' => [
					'controller' => AfifWork\Account\Controller\WelcomeController::class,
					'action'     => 'index',
				],
			],
		],
		'db' => [
			'type' => 'literal',
			'options' => [
				'route' => '/db',
				'defaults' => [
					'controller' => AfifWork\Account\Controller\WelcomeController::class,
					'action'     => 'db',
				],
			],
		],
    ],
	'notfound' => [
		'controller' => AfifWork\Account\Controller\NotfoundController::class,
		'action'     => 'index',
	]
);