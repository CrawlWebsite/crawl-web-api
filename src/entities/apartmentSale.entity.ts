import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Sale } from './sale.entity';
import { Apartment } from './apartment.entity';
import { Publisher } from './publisher.entity';

@Entity('apartment-sales')
export class ApartmentSale extends BaseEntity {
  @Column({ unique: true })
  public url: string;

  @Column({ nullable: true })
  public startDate: Date;

  @Column({ nullable: true })
  public endDate: Date;

  @OneToOne(() => Apartment, (apartment) => apartment.apartmentSale, {
    cascade: true,
  })
  @JoinColumn()
  apartment: Apartment;

  @ManyToOne(() => Sale, (sale) => sale.apartmentSales)
  sale: Sale;

  @ManyToOne(() => Publisher, (publisher) => publisher.apartmentSales)
  publisher: Publisher;
}
