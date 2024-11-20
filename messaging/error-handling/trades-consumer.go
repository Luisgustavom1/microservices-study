package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

func main() {
	nc, err := nats.Connect("nats://127.0.0.1:4222")
	if err != nil {
		log.Fatal(err)
	}
	defer nc.Close()

	js, err := jetstream.New(nc)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	stream := RetrieveStream(js, StreamConfig{
		Name:     "trade-consumer",
		Subjects: []string{"trade.*"},
	}, ctx)

	cc := BuildConsumer(stream, ConsumerConfig{
		Handler: processTrade(js, ctx),
		HandlerErr: func(consumeCtx jetstream.ConsumeContext, err error) {
			fmt.Println(err)
		},
	}, ctx)
	defer cc.Drain()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
}

func processTrade(js jetstream.JetStream, ctx context.Context) func(msg jetstream.Msg) {
	return func(msg jetstream.Msg) {
		order := string(msg.Data())
		invalidTrade := len(strings.Split(order, " ")) > 1 || len(strings.Split(order, ",")) != 4

		if invalidTrade {
			tradeId := msg.Headers().Get("trade-id")
			tradeRetry := msg.Headers().Get("trade-retry")

			fmt.Println("Error placing trade", order)
			fmt.Println("Sending to trade error processor  <-- delegate the error fixing and move on")
			js.PublishMsg(ctx, &nats.Msg{
				Subject: fmt.Sprintf("%s.error", msg.Subject()),
				Data:    msg.Data(),
				Header: nats.Header{
					"trade-id":    []string{tradeId},
					"trade-retry": []string{tradeRetry},
				},
			})
		} else {
			fmt.Println("Trade Placed", order)
		}

		msg.Ack()
	}
}
