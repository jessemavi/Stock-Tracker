package main 

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    _ "github.com/lib/pq"
)

var db *sql.DB

var allStocks []Stock

type Stock struct {
    Symbol string `json:"symbol"`
    Name string `json:"name"`
}

type BookmarkedStock struct {
    ID int `json:"id"`
    Symbol string `json:"symbol"`
}

// separate get request into separate function.
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

    res, err := http.Get("https://api.iextrading.com/1.0/ref-data/symbols")
    if err != nil {
        fmt.Println(err)
        return
    }

    // https://blog.alexellis.io/golang-json-api-client/
    body, readErr := ioutil.ReadAll(res.Body)
    if readErr != nil {
        log.Fatal(readErr)
    }

    jsonErr := json.Unmarshal(body, &allStocks)
    if jsonErr != nil {
        log.Fatal(jsonErr)
    }

    fmt.Println("Connected to database and fetched all stock symbols")
}

func main() {
    http.HandleFunc("/allStocks", getAllStocks)
    http.HandleFunc("/bookmarkedStocks", getStocks)
    http.HandleFunc("/bookmarkedStock", getStock)
    http.HandleFunc("/bookmarkedStocks/add", addStock)
    http.HandleFunc("/bookmarkedStocks/remove", removeStock)
    http.ListenAndServe(":8080", nil)
}

func getAllStocks(w http.ResponseWriter, r *http.Request) {
    if(r.Method != "GET") {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    // marshall allStocks slice into JSON and send as a response
    output, err := json.Marshal(allStocks)
    if err != nil {
        fmt.Println(err)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
    w.Write(output)
}

// post request to get all bookmarked stocks
func getStocks(w http.ResponseWriter, r *http.Request) {
    // db query to get stocks
        // create structs with stock info from db
    // marshal stock structs into json
    // write json as response

    if(r.Method != "POST") {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    stocks := []BookmarkedStock{}

    rows, err := db.Query("select * from bookmarked_stocks")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer rows.Close()

    for rows.Next() {
        stock := BookmarkedStock{}
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

// get a bookmarked stock
func getStock(w http.ResponseWriter, r *http.Request) {
    if(r.Method != "POST") {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        fmt.Println(err)
        return
    }

    stock := BookmarkedStock{}

    err = json.Unmarshal(body, &stock)
    if err != nil {
        log.Fatal(err)
    }

    rows, err := db.Query("select * from bookmarked_stocks where symbol = $1", stock.Symbol)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer rows.Close()

    retrievedStock := BookmarkedStock{}
    for rows.Next() {
        err = rows.Scan(&retrievedStock.ID, &retrievedStock.Symbol)
        if err != nil {
            fmt.Println(err)
            return
        }
    }

    output, err := json.Marshal(retrievedStock)
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

    stock := BookmarkedStock{}

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
