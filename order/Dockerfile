FROM golang:1.19

WORKDIR /go/src/

COPY . .

RUN GOOS=linux go build -ldflags="-s -w"

CMD ["./order --opt checkout"]