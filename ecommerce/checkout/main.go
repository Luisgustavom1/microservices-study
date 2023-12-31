package main

import (
	"checkout/queue"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

type Product struct {
	Uuid    string  `json:"uuid"`
	Product string  `json:"product"`
	Price   float64 `json:"price,string"`
}

type Order struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	ProductId string `json:"productId"`
}

var productsUrl string

func init() {
	productsUrl = os.Getenv("PRODUCT_URL")
}

func main() {
	r := chi.NewRouter()

	r.HandleFunc("/finish", finish)
	r.HandleFunc("/{id}", makeCheckout)

	log.Println("Start server :4042")
	http.ListenAndServe(":4042", r)
}

func finish(w http.ResponseWriter, r *http.Request) {
	var order Order
	order.Name = r.FormValue("name")
	order.Email = r.FormValue("email")
	order.Phone = r.FormValue("phone")
	order.ProductId = r.FormValue("productId")

	data, _ := json.Marshal(order)

	connection := queue.Connect()
	queue.Notify(data, "checkout", "", connection)

	w.Write([]byte("Processed Checkout"))
}

func makeCheckout(w http.ResponseWriter, r *http.Request) { 
	productId := chi.URLParam(r, "id")
	product := loadProductById(productId)
	t := template.Must(template.ParseFiles("templates/checkout.html"))
	t.Execute(w, product)
}

func loadProductById(productId string) Product {
	response, err := http.Get(productsUrl + "/products/" + productId)
	if err != nil {
		fmt.Printf("Http request failed %s\n", err)
	}

	data, _ := io.ReadAll(response.Body)

	var product Product
	json.Unmarshal(data, &product)

	return product
}
