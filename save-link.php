<?php
// تنظیم مسیر فایل
$file_path = 'link.txt';

// دریافت لینک از درخواست POST
if (isset($_POST['link'])) {
    $link = trim($_POST['link']);
    
    // اعتبارسنجی ساده لینک
    if (filter_var($link, FILTER_VALIDATE_URL)) {
        // ذخیره لینک در فایل
        if (file_put_contents($file_path, $link) !== false) {
            echo 'success';
        } else {
            echo 'error';
        }
    } else {
        echo 'invalid';
    }
} else {
    echo 'no_link';
}
?>