import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ApartmentSale } from './apartmentSale.entity';

@Entity('publisher')
export class Publisher extends BaseEntity {
  @Column({ unique: true })
  public hostname: string;

  @OneToMany(() => ApartmentSale, (apartmentSale) => apartmentSale.publisher)
  apartmentSales: ApartmentSale[];
}
