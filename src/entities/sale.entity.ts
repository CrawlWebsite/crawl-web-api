import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApartmentSale } from './apartmentSale.entity';

@Entity('sales')
export class Sale extends BaseEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public phoneNumber: string;

  @OneToMany(() => ApartmentSale, (apartmentSale) => apartmentSale.sale)
  apartmentSales: ApartmentSale[];
}
