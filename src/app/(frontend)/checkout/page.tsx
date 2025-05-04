"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/app/components/Cart/cart-context"
import { formatBDTNumber } from "@/lib/utils"


interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    options?: { name: string; value: string }[];
    path: string;
}

interface OrderSummaryProps {
    cartItems: CartItem[];
    subtotal: number;
}

export default function CheckoutPage() {
    const { cartItems, subtotal, clearCart } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    if (cartItems.length === 0 && !isComplete) {
        return (
            <div className="container px-4 py-12 mx-auto text-center">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="mt-4">You need to add items to your cart before checking out.</p>
                <Button asChild className="mt-6">
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        )
    }

    if (isComplete) {
        return (
            <div className="max-w-screen-2xl py-12 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
                <Card className="text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3">
                                <ShieldCheck className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="font-medium">Order #12345</p>
                            <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button asChild className="py-5">
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate payment processing
        setTimeout(() => {
            setIsSubmitting(false)
            setIsComplete(true)
            clearCart()
        }, 2000)
    }

    return (
        <div className="max-w-screen-2xl py-12 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className="flex items-center mb-8">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/cart">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Cart
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" type="tel" required />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                                        <Input id="apartment" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Select defaultValue="">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DA">Dhaka</SelectItem>
                                                    <SelectItem value="CTG">Chittagong</SelectItem>
                                                    <SelectItem value="RAJ">Rajshahi</SelectItem>
                                                    <SelectItem value="KHL">Khulna</SelectItem>
                                                    <SelectItem value="BAR">Barisal</SelectItem>
                                                    <SelectItem value="SYL">Sylhet</SelectItem>
                                                    <SelectItem value="RAN">Rangpur</SelectItem>
                                                    <SelectItem value="MYM">Mymensingh</SelectItem>
                                                    <SelectItem value="BGR">Bagerhat</SelectItem>
                                                    <SelectItem value="BNB">Bandarban</SelectItem>
                                                    <SelectItem value="BNA">Barguna</SelectItem>
                                                    <SelectItem value="BRS">Barisal</SelectItem>
                                                    <SelectItem value="BHO">Bhola</SelectItem>
                                                    <SelectItem value="BOG">Bogra</SelectItem>
                                                    <SelectItem value="BRA">Brahmanbaria</SelectItem>
                                                    <SelectItem value="CHP">Chandpur</SelectItem>
                                                    <SelectItem value="CHN">Chapai Nawabganj</SelectItem>
                                                    <SelectItem value="CHT">Chittagong</SelectItem>
                                                    <SelectItem value="CHD">Chuadanga</SelectItem>
                                                    <SelectItem value="COM">Comilla</SelectItem>
                                                    <SelectItem value="COX">Cox's Bazar</SelectItem>
                                                    <SelectItem value="DHK">Dhaka</SelectItem>
                                                    <SelectItem value="DIN">Dinajpur</SelectItem>
                                                    <SelectItem value="FAR">Faridpur</SelectItem>
                                                    <SelectItem value="FEN">Feni</SelectItem>
                                                    <SelectItem value="GAI">Gaibandha</SelectItem>
                                                    <SelectItem value="GAZ">Gazipur</SelectItem>
                                                    <SelectItem value="GOP">Gopalganj</SelectItem>
                                                    <SelectItem value="HAB">Habiganj</SelectItem>
                                                    <SelectItem value="JAM">Jamalpur</SelectItem>
                                                    <SelectItem value="JES">Jessore</SelectItem>
                                                    <SelectItem value="JHA">Jhalakathi</SelectItem>
                                                    <SelectItem value="JHE">Jhenaidah</SelectItem>
                                                    <SelectItem value="JYP">Joypurhat</SelectItem>
                                                    <SelectItem value="KHA">Khagrachhari</SelectItem>
                                                    <SelectItem value="KHU">Khulna</SelectItem>
                                                    <SelectItem value="KIS">Kishoreganj</SelectItem>
                                                    <SelectItem value="KUR">Kurigram</SelectItem>
                                                    <SelectItem value="KUS">Kushtia</SelectItem>
                                                    <SelectItem value="LAK">Lakshmipur</SelectItem>
                                                    <SelectItem value="LAL">Lalmonirhat</SelectItem>
                                                    <SelectItem value="MAD">Madaripur</SelectItem>
                                                    <SelectItem value="MAG">Magura</SelectItem>
                                                    <SelectItem value="MAN">Manikganj</SelectItem>
                                                    <SelectItem value="MEH">Meherpur</SelectItem>
                                                    <SelectItem value="MOU">Moulvibazar</SelectItem>
                                                    <SelectItem value="MUN">Munshiganj</SelectItem>
                                                    <SelectItem value="NAO">Naogaon</SelectItem>
                                                    <SelectItem value="NAR">Narail</SelectItem>
                                                    <SelectItem value="NAS">Narsingdi</SelectItem>
                                                    <SelectItem value="NAT">Natore</SelectItem>
                                                    <SelectItem value="NAW">Nawabganj</SelectItem>
                                                    <SelectItem value="NET">Netrakona</SelectItem>
                                                    <SelectItem value="NIL">Nilphamari</SelectItem>
                                                    <SelectItem value="NOA">Noakhali</SelectItem>
                                                    <SelectItem value="PAB">Pabna</SelectItem>
                                                    <SelectItem value="PAN">Panchagarh</SelectItem>
                                                    <SelectItem value="PAT">Patuakhali</SelectItem>
                                                    <SelectItem value="PIR">Pirojpur</SelectItem>
                                                    <SelectItem value="SAT">Satkhira</SelectItem>
                                                    <SelectItem value="SHA">Shariatpur</SelectItem>
                                                    <SelectItem value="SHE">Sherpur</SelectItem>
                                                    <SelectItem value="SIR">Sirajganj</SelectItem>
                                                    <SelectItem value="SUN">Sunamganj</SelectItem>
                                                    <SelectItem value="TAN">Tangail</SelectItem>
                                                </SelectContent>

                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">ZIP Code</Label>
                                            <Input id="zip" required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                                <Tabs defaultValue="card">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="paypal">SSLCommerz</TabsTrigger>
                                        <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="paypal" className="pt-4">
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <p className="mb-4">You will be redirected to SSLCommerz to complete your purchase securely.</p>
                                            <Button type="button" className="w-full py-5">
                                                Continue with SSLCommerz
                                            </Button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="cod" className="pt-4">
                                        <div className="flex flex-col space-y-4">
                                            <div className="bg-muted p-4 rounded-lg">
                                                <h3 className="font-medium mb-2">Cash on Delivery</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Pay with cash when your order is delivered to your doorstep. A small COD fee may apply.
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-medium">Secure and convenient</p>
                                                    <p className="text-muted-foreground">No need to share payment details online</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-medium">Pay only when you receive</p>
                                                    <p className="text-muted-foreground">Inspect your items before payment</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="text-lg font-medium mb-4">Shipping Method</h2>
                                <RadioGroup defaultValue="standard" className="grid gap-4">
                                    <div className="flex items-start gap-4">
                                        <RadioGroupItem value="standard" id="standard" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <Label htmlFor="standard" className="flex flex-col">
                                                    <span>Standard Shipping</span>
                                                    <span className="text-sm text-muted-foreground mt-1">
                                                        Delivery in 5-7 business days
                                                    </span>
                                                </Label>
                                                <span>Free</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <RadioGroupItem value="express" id="express" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <Label htmlFor="express" className="flex flex-col">
                                                    <span>Express Shipping</span>
                                                    <span className="text-sm text-muted-foreground mt-1">
                                                        Delivery in 2-3 business days
                                                    </span>
                                                </Label>
                                                <span>৳ 70</span>
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="lg:hidden">
                                <OrderSummary cartItems={cartItems} subtotal={subtotal} />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? "Processing..." : "Place Order"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="hidden lg:block">
                    <OrderSummary cartItems={cartItems} subtotal={subtotal} />
                </div>
            </div>
        </div>
    )
}

function OrderSummary({ cartItems, subtotal }: OrderSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{item.quantity} ×</span>
                                <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">৳ {formatBDTNumber(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳ {formatBDTNumber(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>৳ {formatBDTNumber(subtotal)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
