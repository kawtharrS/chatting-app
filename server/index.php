<?php 
require_once("./services/ResponseService.php");
require_once("./routes/apis.php");

$base_dir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($request, $base_dir) === 0) {
    $request = substr($request, strlen($base_dir));
}

if ($request == '') {
    $request = '/';
}

if (isset($apis[$request])) {
    $controller_name = $apis[$request]['controller']; 
    $method = $apis[$request]['method'];
    
    $controller_path = "controllers/{$controller_name}.php";
    
    if (!file_exists($controller_path)) {
        die("Controller file not found: " . realpath($controller_path));
    }
    
    require_once $controller_path;
    
    if (!class_exists($controller_name)) {
        die("Class {$controller_name} not found after including {$controller_path}");
    }
    
    $controller = new $controller_name();
    if (method_exists($controller, $method)) {
        $controller->$method();
    } else {
        echo ResponseService::response(500, "Error: Method {$method} not found in {$controller_name}");
    }
} else {
    echo ResponseService::response(404, "Route Not Found");
}