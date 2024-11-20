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
		Name:     "trade-error-consumer",
		Subjects: []string{"trade.*.error"},
	}, ctx)

	cc := BuildConsumer(stream, ConsumerConfig{
		Handler: processTradeWithError(js, ctx),
		HandlerErr: func(consumeCtx jetstream.ConsumeContext, err error) {
			fmt.Println(err)
		},
	}, ctx)
	defer cc.Drain()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
}

func processTradeWithError(js jetstream.JetStream, ctx context.Context) func(msg jetstream.Msg) {
	return func(msg jetstream.Msg) {
		trade := string(msg.Data())
		fmt.Println("Received Trade Order Error:", trade)

		cn := strings.Split(trade, " ")[:1]
		fixed := strings.Join(cn, ",")

		notCanFix := len(strings.Split(fixed, ",")) != 4
		if notCanFix {
			fmt.Println("Trade Order Cannot Be Fixed:", fixed)
		} else {
			fmt.Println("Trade Fixed:", fixed)
			fmt.Println("Resubmitting Trade For Re-Processing")

			id := msg.Headers().Get("trade-id")
			js.PublishMsg(ctx, &nats.Msg{
				Subject: fmt.Sprintf("trade.%s", id),
				Data:    []byte(fixed),
				Header: nats.Header{
					"trade-id": []string{id},
				},
			})
		}

		msg.Ack()
	}
}
