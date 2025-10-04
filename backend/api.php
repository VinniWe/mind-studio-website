<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data_file = '../data/content.json';

// Load content
function loadContent() {
    global $data_file;
    if (file_exists($data_file)) {
        return json_decode(file_get_contents($data_file), true);
    }
    return null;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'slider':
        $content = loadContent();
        if ($content && isset($content['slider'])) {
            // Filter only active slides and sort by order
            $activeSlides = array_filter($content['slider'], function($slide) {
                return $slide['active'] === true;
            });
            
            usort($activeSlides, function($a, $b) {
                return $a['order'] - $b['order'];
            });
            
            echo json_encode($activeSlides);
        } else {
            echo json_encode([]);
        }
        break;
        
    case 'homepage':
        $content = loadContent();
        if ($content && isset($content['pages']['home'])) {
            echo json_encode($content['pages']['home']);
        } else {
            echo json_encode([]);
        }
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
