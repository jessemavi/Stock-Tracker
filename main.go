package main 

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "net/http"
    _ "github.com/lib/pq"
)

var db *sql.DB

type Stock struct {
    ID int `json:"id"`
    Symbol string `json:"symbol"`
}

func init() {
    var err error

    db, err = sql.Open("postgres", "dbname=stock_tracker_2 sslmode=disable")
    if err != nil {
        panic(err)
    }

    _, err = db.Query(`
        create table if not exists bookmarked_stocks (
            id serial primary key,
            symbol varchar unique not null
        );
    `)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Connected to database")
}

func main() {
    http.HandleFunc("/stocks", getStocks)
    http.HandleFunc("/stocks/add", addStock)
    http.HandleFunc("/stocks/remove", removeStock)
    http.ListenAndServe(":8080", nil)
}

// post request to get all stocks
func getStocks(w http.ResponseWriter, r *http.Request) {
    // db query to get stocks
        // create structs with stock info from db
    // marshal stock structs into json
    // write json as response

    if(r.Method != "POST") {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    stocks := []Stock{}

    rows, err := db.Query("select * from bookmarked_stocks")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer rows.Close()

    for rows.Next() {
        stock := Stock{}
        err = rows.Scan(&stock.ID, &stock.Symbol)
        if err != nil {
            fmt.Println(err)
            return
        }
        stocks = append(stocks, stock)
    }

    output, err := json.Marshal(stocks)
    if err != nil {
        fmt.Println(err)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
    w.Write(output)

    fmt.Println(string(output))
}


// post request to add a stock
func addStock(w http.ResponseWriter, r *http.Request) {
    // take stock object from json request body and parse it with decoder into a stock struct
    // extract data from stock struct to insert
    // insert stock data into db

    if r.Method != "POST" {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    stock := Stock{}

    decoder := json.NewDecoder(r.Body)
    err := decoder.Decode(&stock)
    if err != nil {
        fmt.Println(err)
        return
    }
    _, err = db.Exec("insert into bookmarked_stocks (symbol) values ($1)", stock.Symbol)
    if err != nil {
        fmt.Println(err)
        return
    }

    w.WriteHeader(http.StatusCreated)
}

// delete request to remove a stock
func removeStock(w http.ResponseWriter, r *http.Request) {
    // take stock symbol from request query params
    // delete from db with symbol

    if r.Method != "DELETE" {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    symbol := r.URL.Query().Get("symbol")

    _, err := db.Exec("delete from bookmarked_stocks where symbol = $1", symbol)
    if err != nil {
        fmt.Println(err)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}
