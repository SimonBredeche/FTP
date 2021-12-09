<?php
require_once("Airtable.php");
class Users{

    private $name;
    private $password;

    function __construct($name, $password)
    {
        $this->name = $name;
        $this->password = $password;
    }


}



?>