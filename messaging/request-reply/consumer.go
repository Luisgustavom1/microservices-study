package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/nats-io/nats.go"
)

func main() {
	url := os.Getenv("NATS_URL")
	if url == "" {
		url = nats.DefaultURL
	}

	nc, _ := nats.Connect(url)
	defer nc.Drain()

	sub, _ := nc.Subscribe("greet.*", func(msg *nats.Msg) {
		cid := msg.Header.Get("id")
		name := msg.Subject[6:]

		fmt.Printf("[%s] Received a message for %s\n", cid, msg.Subject)

		reply := &nats.Msg{
			Subject: msg.Subject,
			Data:    []byte("hello, " + name),
			Header: nats.Header{
				"id":  []string{uuid.New().String()},
				"cid": []string{cid},
			},
		}

		time.Sleep(1 * time.Second)
		msg.RespondMsg(reply)
	})
	defer sub.Unsubscribe()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
}
