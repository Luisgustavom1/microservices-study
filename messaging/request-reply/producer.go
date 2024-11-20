package main

import (
	"fmt"
	"os"
	"sync"
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
				sendRequest(nc, job)
			}
		}(w)
	}

	for i := 1; i <= 5; i++ {
		jobChan <- i
	}
	close(jobChan)

	wg.Wait()
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
