package main

import (
	"context"
	"fmt"
	"log"

	"github.com/nats-io/nats.go/jetstream"
)

type (
	StreamConfig struct {
		Name     string
		Subjects []string
	}

	ConsumerConfig struct {
		Handler    func(msg jetstream.Msg)
		HandlerErr func(consumeCtx jetstream.ConsumeContext, err error)
	}
)

func RetrieveStream(js jetstream.JetStream, config StreamConfig, ctx context.Context) jetstream.Stream {
	stream, err := js.CreateOrUpdateStream(ctx, jetstream.StreamConfig{
		Name:     config.Name,
		Subjects: config.Subjects,
	})

	if err != nil {
		log.Fatal(err)
		return nil
	}

	return stream
}

func BuildConsumer(stream jetstream.Stream, config ConsumerConfig, ctx context.Context) jetstream.ConsumeContext {
	fmt.Printf("[%s] starting consumer...\n", stream.CachedInfo().Config.Name)

	cons, err := stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Durable: "processor",
	})

	if err != nil {
		log.Fatal(err)
		return nil
	}

	cc, err := cons.Consume(config.Handler, jetstream.ConsumeErrHandler(config.HandlerErr))
	if err != nil {
		log.Fatal(err)
		return nil
	}

	return cc
}
