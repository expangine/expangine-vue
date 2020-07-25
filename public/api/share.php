<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('false');
}

$password = 'expangine4life';
$secret = $_POST['secret'];

if ($secret !== $password) {
    die('false');
}

$name = $_POST['name'];
$path = '../shares/' . $name;

if (!$name || file_exists($path)) {
    die('false');
}

$data = $_POST['data'];
$decoded = json_decode($data);

if ($decoded === null) {
    die('false');
}

die (file_put_contents($path, $data) ? 'true' : 'false');