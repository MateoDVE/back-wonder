import { DataSource, DataSourceOptions } from 'typeorm';
import { Categoria, Producto } from '../../domain/entities';

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'tienda_wonder',
  entities: [Categoria, Producto],
  synchronize: false, // Set to true only for development
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export const appDataSource = new DataSource(typeOrmConfig);

export default typeOrmConfig;
