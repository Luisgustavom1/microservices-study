package queue

import (
	"fmt"
	"os"

	"github.com/streadway/amqp"
)

func Connect() *amqp.Channel {
	dsn := "amqp://" + os.Getenv("RABBITMQ_DEFAULT_USER") + ":" + os.Getenv("RABBITMQ_DEFAULT_PASS") + "@" + os.Getenv("RABBITMQ_DEFAULT_HOST") + ":" + os.Getenv("RABBITMQ_DEFAULT_PORT") + os.Getenv("RABBITMQ_DEFAULT_VHOST")

	conn, err := amqp.Dial(dsn)
	if err != nil {
		panic(err.Error())
	}

	channel, err := conn.Channel()
	if err != nil {
		panic(err.Error())
	}

	return channel
}

func StartConsuming(channel *amqp.Channel, messageCh chan []byte) {
	queue, err := channel.QueueDeclare(
		os.Getenv("RABBITMQ_CONSUMER_QUEUE"),
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		panic(err.Error())
	}

	messages, err := channel.Consume(
		queue.Name,
		os.Getenv("RABBITMQ_CONSUMER_QUEUE"),
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err.Error())
	}

	go func() {
		for message := range messages {
			messageCh <- []byte(message.Body)
		}
		close(messageCh)
	}()
}
