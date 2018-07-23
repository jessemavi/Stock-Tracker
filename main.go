package main 

import (
    "database/sql"
    // "encoding/json"
    "fmt"
    "net/http"
    _ "github.com/lib/pq"
)

var db *sql.DB

type User struct {
    ID int `json:"id"`
    Username string `json:"username"`
    Password string `json:"password"`
}

type Stock struct {
    ID int `json:"id"`
    Symbol string `json:"symbol"`
    User int `json: "user"`
}

func init() {
    var err error
    db, err = sql.Open("postgres", "dbname=stock_tracker sslmode=disable")
    if err != nil {
        panic(err)
    }
    fmt.Println("Connected to database")
}

func main() {
    http.HandleFunc("/", index)
    http.ListenAndServe(":8080", nil)
}

func index(w http.ResponseWriter, r * http.Request) {
    fmt.Fprintf(w, "Stock Tracker")
}
