<?php
//открываем сессию
session_start();
// переменная, в которую будем сохранять результат работы
$data['result']='error';

// если данные были отправлены методом POST, то...
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // устанавливаем результат, равный success
    $data['result']='success';


//    получить имя
    if (isset($_POST['requestName'])) {
        $name = $_POST['requestName'];
        $name = preg_replace("/  +/", " ", $name);
        $name = strip_tags($name);
        $name = htmlspecialchars($name);
        $data['name'] = $name;
    }
    else{
        $data['result']='error';
    }

//    получить email
    if (isset($_POST['requestEmail'])) {
        $email = $_POST['requestEmail'];
        if (!filter_var($email,FILTER_VALIDATE_EMAIL)) {
            $data['result'] = 'error';
            $data['email'] = 'error';
        }
        else{
            $data['email'] = $email;
        }
    }
}
else {
    //данные не были отправлены методом пост
    $data['result']='error';
}

// дальнейшие действия (ошибок не обнаружено)
if ($data['result']=='success') {

    $sendto   = "sgfan@yandex.ru"; // почта, на которую будет приходить письмо

// Формирование заголовка письма
    $headers  = "From: " . "webmaster@новыйвзгляднадетей.рф" . "\r\n";
    $headers .= "Reply-To: ". "" . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html;charset=utf-8 \r\n";

// Формирование тела письма
    $msg  = "<html><body style='font-family:Arial,sans-serif;'>";
    $msg .= "<h3>Регистрация на сайте http://новыйвзгляднадетей.рф</h3>";
    $msg .= "<p><strong>Имя:&nbsp</strong> ".$data['name']."</p>\r\n";
    $msg .= "<p><strong>Email:&nbsp</strong> ".$data['email']."</p>\r\n";
    $msg .= "</body></html>";

// отправка сообщения
    mail($sendto, "НОВЫЙ ВЗГЛЯД НА ДЕТЕЙ", $msg, $headers);
}

// формируем ответ, который отправим клиенту
echo json_encode($data);
