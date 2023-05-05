from flask import Flask
from flask_restful import Api, Resource
import sqlalchemy
from website.main_API import *
from flask_sqlalchemy import SQLAlchemy
from google.cloud.sql.connector import Connector, IPTypes
from website.models.sql_table import db, Packages_table, add_package
import requests
import os
import pymysql


def getconn():
    with Connector() as connector:
        conn = connector.connect(
            "fluted-bot-385510:us-central1:module-registry",
            "pymysql",
            user="root",
            password="",
            db="module-registry	",
            ip_type=IPTypes.PUBLIC
        )
        return conn


def create_app():
    app = Flask(__name__)
    api = Api(app)

    api.add_resource(PackagesList,"/packages")
    api.add_resource(RegistryReset,"/reset")
    api.add_resource(Package,"/package/<string:id>")
    api.add_resource(PackageCreate,"/package")
    api.add_resource(PackageRate,"/package/<string:id>/rate")
    api.add_resource(PackageByRegExGet,"/package/byRegex/<string:rate>")

    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:@/module-registry?unix_socket=/cloudsql/module-registry:us-central1:module-registry"

    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "creator": getconn
    }

    db.init_app(app)
    return app
    

