import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApartmentSale } from './apartmentSale.entity';

@Entity('apartments')
export class Apartment extends BaseEntity {
  @Column({ nullable: true })
  public city: string;

  @Column({ nullable: true })
  public district: string;

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public project: string;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  public acreage: number;

  @Column({ nullable: true })
  public acreageUnit: string;

  @Column({ nullable: true })
  public type: string;

  @Column({ nullable: true })
  public legal: string;

  @Column({ nullable: true })
  public legalStatus: string;

  @Column({ nullable: true })
  public apartmentFloor: number;

  @Column({ nullable: true })
  public numberOfBedRoom: number;

  @Column({ nullable: true })
  public numberOfToilet: number;

  @Column({ nullable: true })
  public numberOfFloor: number;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  public pricePerSquareMeter: number;

  @Column({ nullable: true })
  public pricePerSquareMeterUnit: string;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  public price: number;

  @Column({ nullable: true })
  public priceUnit: string;

  @Column({ nullable: true })
  public balconyDirection: string;

  @Column({ nullable: true })
  public apartmentDirection: string;

  @Column({ nullable: true })
  public interior: string;

  @OneToOne(() => ApartmentSale, (apartmentSale) => apartmentSale.apartment)
  apartmentSale: ApartmentSale;
}
