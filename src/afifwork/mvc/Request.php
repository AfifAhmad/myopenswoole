<?php

namespace AfifWork\MVC;

use Laminas\Http\Request as LaminasRequest;
use Laminas\Http\Exception\RuntimeException;
use Laminas\Http\Exception\InvalidArgumentException;


class Request extends LaminasRequest
{
    public static function fromString($string, $allowCustomMethods = true)
    {
        $request = new static();
        $request->setAllowCustomMethods($allowCustomMethods);

        $lines = preg_split("#\r\n#", $string);

        // first line must be Method/Uri/Version string
        $matches = null;
        $methods = $allowCustomMethods
            ? '[\w-]+'
            : implode(
                '|',
                [
                    self::METHOD_OPTIONS,
                    self::METHOD_GET,
                    self::METHOD_HEAD,
                    self::METHOD_POST,
                    self::METHOD_PUT,
                    self::METHOD_DELETE,
                    self::METHOD_TRACE,
                    self::METHOD_CONNECT,
                    self::METHOD_PATCH,
                ]
            );

        $regex     = '#^(?P<method>' . $methods . ')\s(?P<uri>[^ ]*)(?:\sHTTP\/(?P<version>\d+\.\d+)){0,1}#';
        $firstLine = array_shift($lines);
        if (! preg_match($regex, $firstLine, $matches)) {
            throw new InvalidArgumentException(
                'A valid request line was not found in the provided string'
            );
        }

        $request->setMethod($matches['method']);
        $request->setUri($matches['uri']);

        $parsedUri = parse_url($matches['uri']);
        if (array_key_exists('query', $parsedUri)) {
            $parsedQuery = [];
            parse_str($parsedUri['query'], $parsedQuery);
            $request->setQuery(new Parameters($parsedQuery));
        }

        if (isset($matches['version'])) {
            $request->setVersion($matches['version']);
        }

        if (empty($lines)) {
            return $request;
        }

        $isHeader = true;
        $headers  = $rawBody = [];
        $lines[count($lines)-1] = preg_replace("#^[\r\n]{1}#","", $lines[count($lines)-1]);
        while ($lines) {
            $nextLine = array_shift($lines);
            
            if ($nextLine === '') {
                $isHeader = false;
                continue;
            }

            if ($isHeader) {
                if (preg_match("/[\r\n]/", $nextLine)) {
                    throw new RuntimeException('CRLF injection detected');
                }
                $headers[] = $nextLine;
                continue;
            }

            if (
                empty($rawBody)
                && preg_match('/^[a-z0-9!#$%&\'*+.^_`|~-]+:$/i', $nextLine)
            ) {
                throw new RuntimeException('CRLF injection detected');
            }

            $rawBody[] = $nextLine;
        }

        if ($headers) {
            $request->headers = implode("\r\n", $headers);
        }

        if ($rawBody) {
            $request->setContent(implode("\r\n", $rawBody));
        }

        return $request;
    }
}
