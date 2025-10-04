<?php
session_start();

// Configuration
$config = [
    'admin_username' => 'admin',
    'admin_password' => 'mindstudio2024', // Change this!
    'data_file' => '../data/content.json',
    'uploads_dir' => '../uploads/',
    'max_file_size' => 5 * 1024 * 1024, // 5MB
    'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
];

// Helper functions
function loadContent() {
    global $config;
    if (file_exists($config['data_file'])) {
        return json_decode(file_get_contents($config['data_file']), true);
    }
    return [
        'slider' => [
            [
                'id' => 1,
                'title' => 'Die Beziehung zu Dir bestimmt die Qualität',
                'subtitle' => 'Deines Lebens.',
                'description' => 'Systemische Therapie und psychologische Beratung für Einzelpersonen und Organisationen.',
                'meta' => 'Herzlich Willkommen',
                'image_desktop' => '',
                'image_mobile' => '',
                'active' => true,
                'order' => 0
            ],
            [
                'id' => 2,
                'title' => 'Individuelle Therapie',
                'subtitle' => '',
                'description' => 'Gemeinsam entwickeln wir Lösungsansätze für mehr Lebensqualität und persönliche Entwicklung.',
                'meta' => 'Einzelpersonen',
                'image_desktop' => '',
                'image_mobile' => '',
                'active' => true,
                'order' => 1
            ],
            [
                'id' => 3,
                'title' => 'Team-Entwicklung',
                'subtitle' => '',
                'description' => 'Workshops und Moderation für starke Teams und gesunde Unternehmenskultur.',
                'meta' => 'Organisationen',
                'image_desktop' => '',
                'image_mobile' => '',
                'active' => true,
                'order' => 2
            ]
        ],
        'pages' => [
            'home' => [
                'stats' => [
                    [
                        'text' => '1 von 4 Personen kämpft mit psychischen Herausforderungen im Jahr.',
                        'source' => 'Statistisches Bundesamt (2023)'
                    ],
                    [
                        'text' => 'Systemische Therapie zeigt nachweislich positive Effekte auf Lebensqualität.',
                        'source' => 'DGSF (2022)'
                    ],
                    [
                        'text' => 'Weil wir alle unsere Themen haben.',
                        'source' => 'Mind Studio'
                    ]
                ],
                'services' => [
                    'title' => 'Angebot',
                    'subtitle' => 'Zwei Wege, ein Ziel: mehr Klarheit, Verbindung und Wirksamkeit.',
                    'individual' => [
                        'title' => 'FÜR EINZELPERSONEN',
                        'heading' => 'Therapie & psychologische Beratung',
                        'description' => 'Systemische Therapie, Beratung und Begleitung in herausfordernden Lebensphasen – persönlich und online.'
                    ],
                    'organizations' => [
                        'title' => 'FÜR ORGANISATIONEN',
                        'heading' => 'Teams & Organisationen',
                        'description' => 'Workshops, Moderation und Organisationsentwicklung – für Zusammenarbeit, Kultur und gesunde Leistung.'
                    ]
                ]
            ]
        ]
    ];
}

function saveContent($content) {
    global $config;
    $data_dir = dirname($config['data_file']);
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }
    return file_put_contents($config['data_file'], json_encode($content, JSON_PRETTY_PRINT));
}

function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

// Handle login
if ($_POST['action'] ?? '' === 'login') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === $config['admin_username'] && $password === $config['admin_password']) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Invalid username or password';
    }
}

// Handle logout
if ($_GET['action'] ?? '' === 'logout') {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Handle AJAX requests
if (isset($_POST['ajax'])) {
    requireLogin();
    header('Content-Type: application/json');
    
    switch ($_POST['ajax']) {
        case 'save_slider':
            $content = loadContent();
            $slider_data = json_decode($_POST['slider_data'], true);
            
            if ($slider_data) {
                $content['slider'] = $slider_data;
                if (saveContent($content)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Failed to save']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'Invalid data']);
            }
            exit;
            
        case 'upload_image':
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['image'];
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                
                if (in_array($ext, $config['allowed_types']) && $file['size'] <= $config['max_file_size']) {
                    $filename = 'slider_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    $upload_path = $config['uploads_dir'] . $filename;
                    
                    if (!is_dir($config['uploads_dir'])) {
                        mkdir($config['uploads_dir'], 0755, true);
                    }
                    
                    if (move_uploaded_file($file['tmp_name'], $upload_path)) {
                        echo json_encode(['success' => true, 'filename' => $filename, 'url' => '../uploads/' . $filename]);
                    } else {
                        echo json_encode(['success' => false, 'error' => 'Upload failed']);
                    }
                } else {
                    echo json_encode(['success' => false, 'error' => 'Invalid file type or size']);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'No file uploaded']);
            }
            exit;
    }
}

// Check if user is logged in
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$content = loadContent();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mind Studio CMS</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc; 
            color: #2d3748;
        }
        .header {
            background: #fff;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo { font-size: 1.5rem; font-weight: 600; color: #2d3748; }
        .logout { 
            background: #e53e3e; 
            color: white; 
            padding: 0.5rem 1rem; 
            border: none; 
            border-radius: 0.375rem; 
            cursor: pointer;
            text-decoration: none;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .section {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            overflow: hidden;
        }
        .section-header {
            background: #f7fafc;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            font-weight: 600;
        }
        .section-content { padding: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 500; 
        }
        .form-group input, .form-group textarea, .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
        }
        .form-group textarea { min-height: 100px; resize: vertical; }
        .btn {
            background: #3182ce;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 1rem;
            margin-right: 0.5rem;
        }
        .btn:hover { background: #2c5aa0; }
        .btn-success { background: #38a169; }
        .btn-success:hover { background: #2f855a; }
        .btn-danger { background: #e53e3e; }
        .btn-danger:hover { background: #c53030; }
        .slider-item {
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f9fafb;
        }
        .slider-item h3 { margin-bottom: 1rem; color: #2d3748; }
        .image-preview {
            max-width: 200px;
            max-height: 100px;
            object-fit: cover;
            border-radius: 0.25rem;
            margin: 0.5rem 0;
        }
        .drag-handle { cursor: move; color: #718096; margin-right: 0.5rem; }
        .sortable-placeholder {
            border: 2px dashed #cbd5e0;
            background: #f7fafc;
            height: 80px;
            margin-bottom: 1rem;
            border-radius: 0.375rem;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
</head>
<body>
    <div class="header">
        <div class="logo">Mind Studio CMS</div>
        <a href="?action=logout" class="logout">Logout</a>
    </div>

    <div class="container">
        <div class="section">
            <div class="section-header">Slider Management</div>
            <div class="section-content">
                <p style="margin-bottom: 1rem; color: #718096;">
                    Verwalten Sie die Slider-Inhalte Ihrer Homepage. Ziehen Sie die Elemente zum Neuordnen.
                </p>
                
                <div id="slider-list">
                    <?php foreach ($content['slider'] as $index => $slide): ?>
                    <div class="slider-item" data-id="<?= $slide['id'] ?>">
                        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                            <span class="drag-handle">⋮⋮</span>
                            <h3>Slide <?= $index + 1 ?>: <?= htmlspecialchars($slide['title']) ?></h3>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <div class="form-group">
                                    <label>Meta Text:</label>
                                    <input type="text" name="meta[]" value="<?= htmlspecialchars($slide['meta']) ?>">
                                </div>
                                <div class="form-group">
                                    <label>Titel:</label>
                                    <input type="text" name="title[]" value="<?= htmlspecialchars($slide['title']) ?>">
                                </div>
                                <div class="form-group">
                                    <label>Untertitel:</label>
                                    <input type="text" name="subtitle[]" value="<?= htmlspecialchars($slide['subtitle']) ?>">
                                </div>
                                <div class="form-group">
                                    <label>Beschreibung:</label>
                                    <textarea name="description[]"><?= htmlspecialchars($slide['description']) ?></textarea>
                                </div>
                            </div>
                            
                            <div>
                                <div class="form-group">
                                    <label>Desktop Bild:</label>
                                    <input type="file" name="image_desktop[]" accept="image/*" onchange="uploadImage(this, 'desktop', <?= $slide['id'] ?>)">
                                    <?php if ($slide['image_desktop']): ?>
                                        <img src="../uploads/<?= $slide['image_desktop'] ?>" class="image-preview" alt="Desktop">
                                    <?php endif; ?>
                                </div>
                                <div class="form-group">
                                    <label>Mobile Bild:</label>
                                    <input type="file" name="image_mobile[]" accept="image/*" onchange="uploadImage(this, 'mobile', <?= $slide['id'] ?>)">
                                    <?php if ($slide['image_mobile']): ?>
                                        <img src="../uploads/<?= $slide['image_mobile'] ?>" class="image-preview" alt="Mobile">
                                    <?php endif; ?>
                                </div>
                                <div class="form-group">
                                    <label>
                                        <input type="checkbox" name="active[]" <?= $slide['active'] ? 'checked' : '' ?>>
                                        Aktiv
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <input type="hidden" name="slide_id[]" value="<?= $slide['id'] ?>">
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button onclick="addNewSlide()" class="btn btn-success">+ Neuer Slide</button>
                <button onclick="saveSlider()" class="btn">Speichern</button>
            </div>
        </div>

        <div class="section">
            <div class="section-header">Homepage Inhalte</div>
            <div class="section-content">
                <div class="form-group">
                    <label>Statistik 1:</label>
                    <input type="text" name="stat1" value="<?= htmlspecialchars($content['pages']['home']['stats'][0]['text']) ?>">
                </div>
                <div class="form-group">
                    <label>Statistik 2:</label>
                    <input type="text" name="stat2" value="<?= htmlspecialchars($content['pages']['home']['stats'][1]['text']) ?>">
                </div>
                <div class="form-group">
                    <label>Statistik 3:</label>
                    <input type="text" name="stat3" value="<?= htmlspecialchars($content['pages']['home']['stats'][2]['text']) ?>">
                </div>
                <button onclick="saveHomepage()" class="btn">Homepage speichern</button>
            </div>
        </div>
    </div>

    <script>
        // Initialize sortable
        const sliderList = document.getElementById('slider-list');
        const sortable = new Sortable(sliderList, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-placeholder'
        });

        let slideIdCounter = <?= max(array_column($content['slider'], 'id')) + 1 ?>;

        function addNewSlide() {
            const newSlide = document.createElement('div');
            newSlide.className = 'slider-item';
            newSlide.setAttribute('data-id', slideIdCounter);
            newSlide.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <span class="drag-handle">⋮⋮</span>
                    <h3>Neuer Slide</h3>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <div class="form-group">
                            <label>Meta Text:</label>
                            <input type="text" name="meta[]" value="">
                        </div>
                        <div class="form-group">
                            <label>Titel:</label>
                            <input type="text" name="title[]" value="">
                        </div>
                        <div class="form-group">
                            <label>Untertitel:</label>
                            <input type="text" name="subtitle[]" value="">
                        </div>
                        <div class="form-group">
                            <label>Beschreibung:</label>
                            <textarea name="description[]"></textarea>
                        </div>
                    </div>
                    
                    <div>
                        <div class="form-group">
                            <label>Desktop Bild:</label>
                            <input type="file" name="image_desktop[]" accept="image/*" onchange="uploadImage(this, 'desktop', ${slideIdCounter})">
                        </div>
                        <div class="form-group">
                            <label>Mobile Bild:</label>
                            <input type="file" name="image_mobile[]" accept="image/*" onchange="uploadImage(this, 'mobile', ${slideIdCounter})">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="active[]" checked>
                                Aktiv
                            </label>
                        </div>
                    </div>
                </div>
                
                <input type="hidden" name="slide_id[]" value="${slideIdCounter}">
            `;
            
            sliderList.appendChild(newSlide);
            slideIdCounter++;
        }

        function uploadImage(input, type, slideId) {
            if (input.files && input.files[0]) {
                const formData = new FormData();
                formData.append('ajax', 'upload_image');
                formData.append('image', input.files[0]);
                formData.append('type', type);
                formData.append('slide_id', slideId);

                fetch('', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Add image preview
                        const preview = document.createElement('img');
                        preview.src = data.url;
                        preview.className = 'image-preview';
                        preview.alt = type;
                        input.parentNode.appendChild(preview);
                        
                        // Store filename in hidden input
                        const hiddenInput = document.createElement('input');
                        hiddenInput.type = 'hidden';
                        hiddenInput.name = `image_${type}_filename[]`;
                        hiddenInput.value = data.filename;
                        input.parentNode.appendChild(hiddenInput);
                    } else {
                        alert('Upload failed: ' + data.error);
                    }
                });
            }
        }

        function saveSlider() {
            const slides = [];
            const slideItems = document.querySelectorAll('.slider-item');
            
            slideItems.forEach((item, index) => {
                const slide = {
                    id: parseInt(item.querySelector('input[name="slide_id[]"]').value),
                    title: item.querySelector('input[name="title[]"]').value,
                    subtitle: item.querySelector('input[name="subtitle[]"]').value,
                    description: item.querySelector('textarea[name="description[]"]').value,
                    meta: item.querySelector('input[name="meta[]"]').value,
                    active: item.querySelector('input[name="active[]"]').checked,
                    order: index,
                    image_desktop: item.querySelector('input[name="image_desktop_filename[]"]')?.value || '',
                    image_mobile: item.querySelector('input[name="image_mobile_filename[]"]')?.value || ''
                };
                slides.push(slide);
            });

            const formData = new FormData();
            formData.append('ajax', 'save_slider');
            formData.append('slider_data', JSON.stringify(slides));

            fetch('', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Slider gespeichert!');
                } else {
                    alert('Fehler beim Speichern: ' + data.error);
                }
            });
        }

        function saveHomepage() {
            // Implementation for homepage content saving
            alert('Homepage Inhalte speichern - Coming soon!');
        }
    </script>
</body>
</html>
