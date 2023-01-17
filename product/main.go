package main

import (
	"encoding/json"
	"fmt"
	"io"
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

func main() {
	r := chi.NewRouter()

	r.Get("/products", getProducts)
	r.Get("/products/{id}", getProductsById)

	http.ListenAndServe(fmt.Sprintf(":%s", "4040"), r)
}

func getProducts(w http.ResponseWriter, request *http.Request) {
	products := loadData()

	w.Write(products)
}

func getProductsById(w http.ResponseWriter, request *http.Request) {
	productId := chi.URLParam(request, "id")

	data := loadData()

	var products Products
	json.Unmarshal(data, &products)

	for _, product := range products.Products {
		if product.Uuid == productId {
			productJson, _ := json.Marshal(product)
			w.Write([]byte(productJson))
		}
	}
}

func loadData() []byte {
	file, err := os.Open("products.json")
	if err != nil {
		fmt.Sprintln(err)
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		fmt.Sprintln(err)
	}

	return data
}
