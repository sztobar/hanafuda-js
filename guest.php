<?php
require 'include\first.php';
echo             '<form action="'.$_SERVER["PHP_SELF"].'" method="post">';
echo                    '<table>';
echo 					'<tr><td>Imi¿*: <td><input size=\"30\" placeholder="Wpisz swoje imi¿" name="name" type="text" required \><br>';
echo 					'<tr><td>e-mail: <td><input size="30" placeholder="Wpisz swój adres e-mail" name="email" type="text" \><br>';
echo 					'<tr><td>Komentarz*: <td><textarea cols="30" placeholder="Napisz tutaj swoj komentarz" name="comment" type="" required></textarea><br>';
echo 					'<tr><td><td><input type="submit" value="Wy¿lij" name="send"\>';
echo 					'</table>';
echo 				'</form>';

if (isset($_REQUEST['name']) && isset($_REQUEST['comment'])) {
    $save['name'] = $_REQUEST['name'];
    $save['email'] = $_REQUEST['email'] or "";
    $save['date'] = date('d M y h:i:s');
    $save['comment'] = preg_split('/\r\n|\r|\n/', $_REQUEST['comment']);
    $filename = 'guestbook.csv';
    if (($file = fopen($filename, 'rt')) !== false) {
        while (($old[] = fgetcsv($file)) !== false) {
            //$old = fgetcsv($file, filesize($filename));
            //fclose($file);
        }
        fclose($file);
    }
    $file = fopen($filename, 'wt');
    //if ($file) {
    fputcsv($file, array(""));
    fputcsv($file, array($save['name']));
    fputcsv($file, array($save['email']));
    fputcsv($file, array($save['date']));
    fputcsv($file, $save['comment']);
    if ((isset($old)) == true)
        foreach ($old as $data)
            @ fputcsv($file, $data);
        /*fwrite($file, $date."\n");
        fwrite($file, $comment."\n");
        fwrite($file, $old);
        fclose($file);*/
}
require 'guest_notes.php';
require 'include\second.php';
?>
