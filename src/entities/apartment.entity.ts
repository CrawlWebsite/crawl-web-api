import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApartmentSale } from './apartmentSale.entity';

@Entity('apartments')
export class Apartment extends BaseEntity {
  @Column()
  public city: string;

  @Column()
  public district: string;

  @Column()
  public address: string;

  @Column()
  public project: string;

  @Column()
  public acreage: number;

  @Column()
  public acreageUnit: string;

  @Column()
  public type: string;

  @Column()
  public legal: string;

  @Column()
  public legalStatus: string;

  @Column()
  public apartmentFloor: number;

  @Column()
  public numberOfBedRoom: number;

  @Column()
  public numberOfToilet: number;

  @Column()
  public numberOfFloor: number;

  @Column()
  public pricePerSquareMeter: number;

  @Column()
  public pricePerSquareMeterUnit: string;

  @Column()
  public price: number;

  @Column()
  public priceUnit: string;

  @Column()
  public balconyDirection: string;

  @Column()
  public apartmentDirection: string;

  @Column()
  public interior: string;

  @OneToOne(() => ApartmentSale, (apartmentSale) => apartmentSale.apartment)
  apartmentSale: ApartmentSale;
}
