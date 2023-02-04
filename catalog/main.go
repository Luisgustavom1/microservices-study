package main

import (
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

type Products struct {
	Products []Product
}

var productsUrl string

func init() {
	productsUrl = os.Getenv("PRODUCT_URL")
}

func main() {
	r := chi.NewRouter()

	r.Get("/", listProducts)
	r.Get("/product/{id}", showProduct)

	log.Println("Start serve :4041")
	http.ListenAndServe(":4041", r)
}

func listProducts(w http.ResponseWriter, request *http.Request) {
	products := loadProducts()
	t := template.Must(template.ParseFiles("templates/catalog.html"))
	t.Execute(w, products)
}

func showProduct(w http.ResponseWriter, request *http.Request) {
	productId := chi.URLParam(request, "id")
	product := loadProductById(productId)
	t := template.Must(template.ParseFiles("templates/view.html"))
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

func loadProducts() []Product {
	response, err := http.Get(productsUrl + "/products")
	if err != nil {
		fmt.Printf("Http request failed %s\n", err)
	}

	data, _ := io.ReadAll(response.Body)

	var products Products
	json.Unmarshal(data, &products)

	return products.Products
}
