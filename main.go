package main 

import (
    "database/sql"
    "encoding/json"
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
    http.HandleFunc("/stocks", getStocks)
    http.HandleFunc("/stocks/add", addStock)
    http.HandleFunc("/stocks/remove", removeStock)
    http.ListenAndServe(":8080", nil)
}

func index(w http.ResponseWriter, r * http.Request) {
    fmt.Fprintf(w, "Stock Tracker")
}

// post request to get all stocks for a user
func getStocks(w http.ResponseWriter, r *http.Request) {
    // get user id from post request body by decoding
    // go through stocks and get stocks with user id
        // create structs with stock info from db
    // marshal stock structs into json
    // write json as response

    if(r.Method != "POST") {
        http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
        return
    }

    user := User{}

    decoder := json.NewDecoder(r.Body)
    err := decoder.Decode(&user)
    if err != nil {
        fmt.Println(err)
        return
    }

    stocks := []Stock{}

    rows, err := db.Query("select * from stocks where user_id = $1", user.ID)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer rows.Close()

    for rows.Next() {
        stock := Stock{}
        err = rows.Scan(&stock.ID, &stock.Symbol, &stock.User)
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
    _, err = db.Exec("insert into stocks (symbol, user_id) values ($1, $2)", stock.Symbol, stock.User)
    if err != nil {
        fmt.Println(err)
        return
    }
}

// delete request to remove a stock
func removeStock(w http.ResponseWriter, r *http.Request) {
    // take stock object from json request body and parse it with decoder into a stock struct
    // extract data from stock struct to delete
    // delete from db with symbol and user id

    if r.Method != "DELETE" {
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

    _, err = db.Exec("delete from stocks where symbol = $1 and user_id = $2", stock.Symbol, stock.User)
    if err != nil {
        fmt.Println(err)
        return
    }
}
