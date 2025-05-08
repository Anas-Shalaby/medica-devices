// src/components/pdf/OrderPDF.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    borderTop: 1,
    paddingTop: 10,
    fontWeight: "bold",
  },
});

interface OrderPDFProps {
  order: any;
}

const OrderPDF = ({ order }: OrderPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Order #{order.orderNumber}</Text>
        <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
      </View>

      {/* Order Information */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Order Information
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{order.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Status:</Text>
          <Text style={styles.value}>{order.paymentInfo.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{order.paymentInfo.method}</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Order Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Unit Price</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {/* Table Rows */}
          {order.items.map((item: any) => (
            <View key={item._id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>
                {item.unitPrice.amount} {item.unitPrice.currency}
              </Text>
              <Text style={styles.tableCell}>
                {item.totalPrice.amount} {item.totalPrice.currency}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Billing Information */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Billing Information
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>
            {order.billing.subtotal} {order.billing.currency}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax:</Text>
          <Text style={styles.value}>
            {order.billing.tax} {order.billing.currency}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Shipping:</Text>
          <Text style={styles.value}>
            {order.billing.shipping} {order.billing.currency}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Discount:</Text>
          <Text style={styles.value}>
            {order.billing.discount} {order.billing.currency}
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>
            {order.billing.total} {order.billing.currency}
          </Text>
        </View>
      </View>

      {/* Shipping Information */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Shipping Information
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Recipient:</Text>
          <Text style={styles.value}>{order.shippingAddress.recipient}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>
            {order.shippingAddress.street}
            {"\n"}
            {order.shippingAddress.city}, {order.shippingAddress.state}
            {"\n"}
            {order.shippingAddress.zipCode}
            {"\n"}
            {order.shippingAddress.country}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default OrderPDF;
