import amqplib from 'amqplib';

type ConnectionOptions = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
};

export class EventBusConnection {
  private static _conn?: amqplib.Connection;

  public constructor() {}

  static async connect(
    connectionData: ConnectionOptions = {}
  ): Promise<amqplib.Connection> {
    if (!this._conn) {
      try {
        const conn = await amqplib.connect(this.createConnectionUrl(connectionData));
        this._conn = conn;

        return conn;
      } catch (error) {
        throw error;
      }
    }

    return this._conn;
  }

  public static disconnect() {
    this._conn?.close();
    this._conn = undefined;
  }

  public static get connection() {
    return this._conn;
  }

  private static createConnectionUrl(options: amqplib.Options.Connect): string {
    const username = options.username || "username";
    const password = options.password || "guest";
    const host = options.hostname || "localhost";
    const port = options.port || 5672;

    return `amqp://${username}:${password}@${host}:${port}`;
  }
}
