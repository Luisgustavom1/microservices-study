package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
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

	stream, err := js.CreateOrUpdateStream(ctx, jetstream.StreamConfig{
		Name:     "trades-error-consumer",
		Subjects: []string{"trades.error.>"},
	})
	if err != nil {
		log.Fatal(err)
	}

	cons, err := stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Durable: "processor",
	})
	if err != nil {
		log.Fatal(err)
	}

	cc, err := cons.Consume(func(msg jetstream.Msg) {
		msg.Ack()
		fmt.Println("received msg on", msg.Subject(), string(msg.Data()))
	}, jetstream.ConsumeErrHandler(func(consumeCtx jetstream.ConsumeContext, err error) {
		fmt.Println(err)
	}))
	if err != nil {
		log.Fatal(err)
	}
	defer cc.Drain()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
}
