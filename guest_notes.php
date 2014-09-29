<?php
ini_set('auto_detect_line_endings', true);
$row = 1;
if (($handle = fopen("guestbook.csv", "r")) !== false) {
    $i = 1;
    while(!feof($handle)){
        $tmp = fgetcsv($handle)[0];
        if (feof($handle))
            break;
        echo "rekord ".$i++."<br>";
        echo "imie - ".fgetcsv($handle)[0]."<br>";
        echo "email - ".fgetcsv($handle)[0]."<br>";
        echo "data - ".fgetcsv($handle)[0]."<br>";
        $comments = fgetcsv($handle);
        foreach ($comments as $lines)
            echo $lines."<br>";
        //if(feof($handle)) break;
    }/*
    while (($data = fgetcsv($handle)) !== false) {
        $num = count($data);
        echo "<p> $num fields in line $row: <br /></p>\n";
        $row++;
        echo $data[0]."<br>";
        echo $data[1]."<br>";
        echo $data[2]."<br>";
        $len = count($data[3]);
        for ($i=0; $i < $len; $i++) {
            echo $data[3][$i] . "<br />\n";
        }
    }*/
    fclose($handle);
}
?>
