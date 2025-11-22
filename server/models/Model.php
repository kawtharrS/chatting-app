<?php
abstract class Model{
    protected static string $table;
    protected int $id;

    private static function bindAndExecute(mysqli $connection, string $sql, array $params=[])
    {
        $stmt=$connection->prepare($sql);
        if(!$stmt) return null;

        if(!empty($params)){
            $types = '';
            foreach($params as $value)
            {
                $types .= is_int($value) ? 'i': 's';
            }
            $stmt->bind_param($types, $params);
        }
        return $stmt;
    }

    private static function fetchObjects(mysqli_stmt $stmt){
        $res= $stmt->get_result();

        $objects=[];
        while($data = $res->fetch_object()){
            $objects[]= new static($data);
        }
        return $objects;
    }

    public static function find(mysqli $connection, string $id, string $primary_key){
        $sql = sprintf("SELECT * FROM %s WHERE id = ?", static::$table);
        $stmt = self::bindAndExecute($connection, $sql, [$id]);
        return $stmt? self::fetchObjects($stmt) : [];
    }

    public static function findALl(mysqli $connection){
        $sql= sprintf("SELECT * FROM %s", static::$table);
        $stmt= self::bindAndExecute($connection, $sql);
        return $stmt? self::fetchObjects($stmt) : [];
    }

    public static function create(mysqli $connection, array $data){
        $columns = implode(',', array_keys($data));
        $placeholders = implode(',', array_fill(0, count($data), '?'));
        $sql = sprintf("INSERT INTO %s ($columns) VALUES ($placeholders", static::$table);
        $stmt=self::bindAndExecute($connection, $sql, array_values($data));

        if(!$stmt && $stmt->affected_rows>0){
            $id = $connection->insert_id;
            return new static(array_merge($data, ["id"=>$id]));
        }
        return false; 
    }

    public function update(mysqli $connection, array $data){
        $columns = implode(',', array_map(fn($key)=>"$key = ?", array_keys($data)));
        $sql = sprintf("UPDATE %s SET %s WHERE id = ?", static::$table);
        $params = array_map(array_values($data), [$this->id]);
        $stmt = self::bindAndExecute($connection, $sql, $params);
        return $stmt? self::fetchObjects($stmt):[];
    }

    public function delete(mysqli $connection){
        $sql = sprintf("DELETE FROM %s WHERE id =?", static::$table);
        $stmt = self::bindAndExecute($connection, $sql, [$this->id]);
        return $stmt? $stmt->affected_rows>0: false;
    }

    public static function where(mysqli $connection, array $conditions){
        $clauses = implode('AND', array_map(fn($key)=>"$key = ?", array_keys($conditions)));
        $sql= sprintf("SELECT * FROM %s WHERE %s", static::$table, $clauses);
        $stmt = self::bindAndExecute($connection, $sql, array_values($conditions));
        return $stmt? self::fetchObjects($stmt) : [];
    }
}
?>