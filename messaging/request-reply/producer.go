package main

import (
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/nats-io/nats.go"
)

const WORKERS = 3

func main() {
	url := os.Getenv("NATS_URL")
	if url == "" {
		url = nats.DefaultURL
	}

	nc, _ := nats.Connect(url)
	defer nc.Drain()

	var wg sync.WaitGroup
	jobChan := make(chan int, 5)

	for w := 0; w < WORKERS; w++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for job := range jobChan {
				fmt.Println("Worker", id, "processing job", job)
				sendRequest(nc, job)
			}
		}(w)
	}

	for i := 1; i <= 5; i++ {

	}

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)

	i := 1
	for {
		switch <-sig {
		case syscall.SIGINT:
			fmt.Println("SIGINT received")
			jobChan <- i
			i++
		case syscall.SIGTERM:
			close(jobChan)
			os.Exit(0)
		}
	}
}

func sendRequest(nc *nats.Conn, i int) {
	msg := &nats.Msg{
		Subject: fmt.Sprintf("greet.%d", i),
		Data:    []byte("hello, " + fmt.Sprint(i)),
		Header:  nats.Header{"id": []string{uuid.New().String()}},
	}
	rep, err := nc.RequestMsg(msg, 30*time.Second)
	if err != nil {
		fmt.Printf("Error sending request %d: %v\n", i, err)
		return
	}
	fmt.Printf("Response for request %d: %s\n", i, string(rep.Data))
}
