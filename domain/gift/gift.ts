import type { GiftProps } from "./gift.types";

export class Gift {
  private props: GiftProps;

  constructor(props: GiftProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get productUrl() {
    return this.props.productUrl;
  }

  get price() {
    return this.props.price;
  }

  get priority() {
    return this.props.priority;
  }

  get timeframe() {
    return this.props.timeframe;
  }

  get status() {
    return this.props.status;
  }

  get owner() {
    return this.props.owner;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get receivedAt() {
    return this.props.receivedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  update(values: Partial<Omit<GiftProps, "id" | "createdAt">>) {
    this.props = {
      ...this.props,
      ...values,
      updatedAt: new Date(),
    };
  }

  markAsReceived() {
    this.props.status = "RECEIVED";
    this.props.receivedAt = new Date();
    this.props.updatedAt = new Date();
  }

  toPlainObject(): GiftProps {
    return { ...this.props };
  }
}

export type { GiftOwner, GiftStatus, GiftTimeframe };
