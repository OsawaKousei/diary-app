# init_db.py
import asyncio
import configparser

import asyncpg
from sqlalchemy.engine.url import make_url


async def create_database_if_not_exists() -> None:
    """
    alembic.iniから接続情報を読み込み、データベースが存在しない場合に作成する
    """
    # alembic.iniをパース
    config = configparser.ConfigParser()
    config.read("alembic.ini")

    # sqlalchemy.urlからURL情報を取得
    url = make_url(config["alembic"]["sqlalchemy.url"])

    db_name = url.database
    db_user = url.username
    db_password = url.password
    db_host = url.host
    db_port = url.port

    # データベースが存在しない場合に作成するため、一時的にデフォルトDB('postgres')に接続
    try:
        conn = await asyncpg.connect(
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
            database="postgres",  # postgresデータベースに接続
        )

        # データベースが存在するか確認
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", db_name
        )

        if not exists:
            print(f"Database '{db_name}' does not exist. Creating it...")
            await conn.execute(f'CREATE DATABASE "{db_name}"')
            print(f"Database '{db_name}' created successfully.")
        else:
            print(f"Database '{db_name}' already exists.")

        await conn.close()

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    asyncio.run(create_database_if_not_exists())
