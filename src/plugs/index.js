import Vue from 'vue'
import ByteArray from './ByteArray'
import Generator from './Generator'
import AES from './AES'
import RSA from './RSA'
import Type from './Type'
import './Date'

Vue.use(ByteArray).use(Generator).use(AES).use(RSA).use(Type)
