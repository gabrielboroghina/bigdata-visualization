# pip install pyspark wget

from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import IntegerType
import wget
import os
from http import server
from pyspark.sql.functions import desc, row_number, when
from pyspark.sql.window import Window
from pyspark.sql.functions import col, when

from http.server import BaseHTTPRequestHandler, HTTPServer
import json

DATA_URL = "https://opendata.ecdc.europa.eu/covid19/nationalcasedeath/csv"


def get_and_process_data():
    spark = SparkSession. \
        builder. \
        appName("pyspark-notebook"). \
        master("local[3]"). \
        config("spark.executor.memory", "512m"). \
        getOrCreate()

    data_file = "full_data.csv"

    if os.path.exists(data_file):
        os.remove(data_file)

    # Get latest data files
    wget.download(DATA_URL, data_file)

    df = spark.read.option("header", True).csv(data_file)

    df = df.withColumn("weekly_count", df["weekly_count"].cast(IntegerType()))

    df = df.withColumn("cases", when(col("indicator") == "cases", col("weekly_count")).otherwise(0))
    df = df.withColumn("deaths", when(col("indicator") == "deaths", col("weekly_count")).otherwise(0))
    df = df.groupby("country").sum("cases", "deaths").orderBy("country")
    df = df.withColumnRenamed("sum(cases)", "cases").withColumnRenamed("sum(deaths)", "deaths")
    df = df.select("country", "cases", "deaths")
    return list(map(lambda row: row.asDict(), df.collect()))


class Server(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        data = get_and_process_data()
        self._set_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))


def run(server_class=HTTPServer, handler_class=Server, port=7777):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


run()
