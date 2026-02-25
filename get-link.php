<?php
// تنظیم مسیر فایل
$file_path = 'link.txt';

// بررسی وجود فایل
if (file_exists($file_path)) {
    // خواندن محتوای فایل
    $content = file_get_contents($file_path);
    echo $content ?: 'هنوز لینکی ثبت نشده است';
} else {
    echo 'هنوز لینکی ثبت نشده است';
}
?>