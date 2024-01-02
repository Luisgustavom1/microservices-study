import amqplib from 'amqplib';

type ConnectionOptions = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
};

export class EventBusConnection {
  private static _conn: amqplib.Connection;

  public constructor() {}

  static async connect(
    connectionData: ConnectionOptions = {}
  ): Promise<amqplib.Connection> {
    if (!EventBusConnection._conn) {
      try {
        const conn = await amqplib.connect(EventBusConnection.createConnectionUrl(connectionData));
        EventBusConnection._conn = conn;

        return conn;
      } catch (error) {
        throw error;
      }
    }

    return EventBusConnection._conn;
  }

  public static disconnect() {
    EventBusConnection._conn?.close();
  }

  public static get connection() {
    return EventBusConnection._conn;
  }

  private static createConnectionUrl(options: amqplib.Options.Connect): string {
    const username = options.username || "username";
    const password = options.password || "guest";
    const host = options.hostname || "localhost";
    const port = options.port || 5672;

    return `amqp://${username}:${password}@${host}:${port}`;
  }
}
